import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { SubscriptionType } from '@/types/types';


export type DataUpload = {
  studentList: boolean;
  staffList: boolean;
};
