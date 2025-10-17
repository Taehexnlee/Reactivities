import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo, useState } from "react";

export const useProfile = (id?: string, predicate?: string) => {
  const [filter, setFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 프로필: predicate가 없을 때만 실행
  const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    enabled: !!id && !predicate,
  });

  // 사진: predicate가 없을 때만 실행
  const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
    queryKey: ["photos", id],
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    enabled: !!id && !predicate,
  });

  // 팔로워/팔로잉 목록: predicate가 있을 때만 실행
  const { data: following, isLoading: loadingFollowings } = useQuery<Profile[]>({
    queryKey: ["followings", id, predicate],
    queryFn: async () => {
      const response = await agent.get<Profile[]>(
        `/profiles/${id}/follow-list?predicate=${predicate}`
      );
      return response.data;
    },
    enabled: !!id && !!predicate,
  });

  const {
    data: userActivities = [],
    isLoading: loadingUserActivities,
  } = useQuery<UserActivity[]>({
    queryKey: ["user-activities", id, filter],
    queryFn: async () => {
      const response = await agent.get<UserActivity[]>(`/profiles/${id}/activities`, {
        params: { filter },
      });
      return response.data;
    },
    enabled: !!id && !!filter,
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await agent.post("/profiles/add-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: async (photo: Photo) => {
      await queryClient.invalidateQueries({ queryKey: ["photos", id] });
      queryClient.setQueryData(["user"], (data: User) => {
        if (!data) return data;
        return { ...data, imageUrl: data.imageUrl ?? photo.url };
      });
      queryClient.setQueryData(["profile", id], (data: Profile) => {
        if (!data) return data;
        return { ...data, imageUrl: data.imageUrl ?? photo.url };
      });
    },
  });

  const setMainPhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      await agent.put(`/profiles/${photo.id}/setMain`);
    },
    onSuccess: (_, photo) => {
      queryClient.setQueryData(["user"], (userData: User) => {
        if (!userData) return userData;
        return { ...userData, imageUrl: photo.url };
      });
      queryClient.setQueryData(["profile", id], (p: Profile) => {
        if (!p) return p;
        return { ...p, imageUrl: photo.url };
      });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      await agent.delete(`/profiles/${photoId}/photos`);
    },
    onSuccess: (_, photoId) => {
      queryClient.setQueryData<Photo[]>(["photos", id], (arr) =>
        arr?.filter((x) => x.id !== photoId)
      );
    },
  });

  const updateFollowing = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await agent.post(`/profiles/${id}/follow`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["profile", id], (p: Profile) => {
        queryClient.invalidateQueries({queryKey: ['followings' , id, 'followers']})
        if (!p || p.followersCount === undefined) return p;
        return {
          ...p,
          following: !p.following,
          followersCount: p.following
            ? p.followersCount - 1
            : p.followersCount + 1,
        };
      });
      // followers 탭만 즉시 동기화
      queryClient.invalidateQueries({ queryKey: ["followings", id, "followers"] });
    },
  });

  const isCurrentUser = useMemo(() => {
    return id === queryClient.getQueryData<User>(["user"])?.id;
  }, [id, queryClient]);

  return {
    profile,
    loadingProfile,
    photos,
    loadingPhotos,
    isCurrentUser,
    userActivities,
    filter,
    setFilter,
    loadingUserActivities,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    updateFollowing,
    loadingFollowings,
    following,
  };
};
