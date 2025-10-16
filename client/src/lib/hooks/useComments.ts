import { useLocalObservable } from "mobx-react-lite";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
  const created = useRef(false);

  const commentStore = useLocalObservable(() => ({
    comments: [] as ChatCommnet[],
    hubConnection: null as HubConnection | null,

    createHubConnection(activityId: string) {
      if (!activityId) return;

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_COMMENT_URL}?activityId=${encodeURIComponent(activityId)}`,
          {
            withCredentials: true,
            // 인증을 허브에 전달해야 하면 아래 사용:
            // accessTokenFactory: () => authStore.token ?? ""
          }
        )
        .withAutomaticReconnect()
        .build();

      this.hubConnection
        .start()
        .catch((error) => console.log("Error establishing connection: ", error));

      // 최초(Caller)에게 목록 로드
      this.hubConnection.on("LoadComments", (items: ChatCommnet[]) => {
        runInAction(() => {
          this.comments = items;
        });
      });

      // 새 댓글 브로드캐스트
      this.hubConnection.on("ReceiveComment", (comment: ChatCommnet) => {
        runInAction(() => {
          this.comments.push(comment); // 오래된→최신 정렬 기준에 따라 push/unshift 선택
        });
      });
    },

    stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection
          .stop()
          .catch((error) => console.log("Error stopping connection: ", error));
      }
    },
  }));

  useEffect(() => {
    if (activityId && !created.current) {
      commentStore.createHubConnection(activityId);
      created.current = true;
    }
    return () => {
      commentStore.stopHubConnection();
      commentStore.comments = [];
    };
  }, [activityId, commentStore]);

  return { commentStore };
};