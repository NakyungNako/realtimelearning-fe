import { Box, Divider, Stack } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EditHeader from "./EditHeader";
import Slide from "./Slide";
import SlideInfo from "./SlideInfo";
import SlidesList from "./SlidesList";

export default function EditPresentation() {
  const { groupId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { setPresent } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getPresentation = async () => {
      try {
        const response = await axiosPrivate.get("/api/present/", {
          params: {
            id: groupId,
          },
          signal: controller.signal,
        });

        if (response.data) {
          isMounted && setPresent(response.data);
        }
        console.log("axiosPrivate", response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPresentation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);
  return (
    <Box>
      <EditHeader />
      <Divider />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <SlidesList />
        <Slide />
        <SlideInfo />
      </Stack>
    </Box>
  );
}
