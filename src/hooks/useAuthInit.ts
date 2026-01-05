"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/services/api";
import { setUser, clearUser, stopLoading } from "@/store/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => dispatch(clearUser()))
      .finally(() => dispatch(stopLoading()));
  }, [dispatch]);
};
