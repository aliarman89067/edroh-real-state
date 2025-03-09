"use client";
import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingMutation,
} from "@/state/api";
import React from "react";

const TenantSettings = () => {
  const { data: authData, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authData?.userInfo?.name,
    email: authData?.userInfo?.email,
    phoneNumber: authData?.userInfo?.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authData?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
