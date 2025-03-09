"use client";
import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingMutation,
  useUpdateTenantSettingMutation,
} from "@/state/api";
import React from "react";

const ManagerSettings = () => {
  const { data: authData, isLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authData?.userInfo?.name,
    email: authData?.userInfo?.email,
    phoneNumber: authData?.userInfo?.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authData?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;
