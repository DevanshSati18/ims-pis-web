"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/services/api";
import { setUser, clearUser } from "@/store/authSlice"; // ✅ NO stopLoading

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        dispatch(setUser(res.data));
      })
      .catch(() => {
        dispatch(clearUser());
      });
  }, [dispatch]);
};
