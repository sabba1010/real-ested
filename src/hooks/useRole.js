// src/hooks/useRole.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const { data: role, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user?.email}`);
      return res.data?.role;
    },
  });

  return [role, isLoading];
};

export default useRole;
