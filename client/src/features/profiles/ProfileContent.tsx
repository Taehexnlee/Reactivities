// ProfileContent.tsx
import { useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProfilePhoto from "./ProfilePhoto";
import ProfileAbout from "./ProfileAbout";

type TabContent = {
  label: string;
  contents: React.ReactNode;
};

export default function ProfileContent() {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // 탭 라벨/콘텐츠 정의 (초기엔 div로 대체)
  const tabContent: TabContent[] = [
    { label: "About",     contents: <ProfileAbout/> },
    { label: "Photos",    contents: <ProfilePhoto /> },
    { label: "Events",    contents: <div>events</div> },
    { label: "Followers", contents: <div>followers</div> },
    { label: "Following", contents: <div>following</div> },
  ];

  return (
    <Box
  component={Paper}
  mt={2}
  p={3}
  elevation={3}
  sx={{
    display: "flex",
    alignItems: "flex-start",
    borderRadius: 3,
    width: "100%",
    minHeight: "calc(100vh - 200px)", // 헤더/여백에 맞춰 조정
  }}
>
      {/* 좌측: 세로 탭 */}
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          borderRight: 1,
          height: 450,
          minWidth: 200,
        }}
      >
        {tabContent.map((t, index) => (
          <Tab key={index} label={t.label} sx={{ mr: 3 }} />
        ))}
      </Tabs>

      {/* 우측: 탭 컨텐츠 */}
      <Box sx={{ flexGrow: 1 , p:3, pt:0}} >
        {tabContent[value].contents}
      </Box>
    </Box>
  );
}