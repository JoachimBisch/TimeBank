```typescript
export interface TimeTransaction {
  id?: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  bookingId: string;
  experienceId: string;
  type: 'booking';
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TransferTimeParams {
  fromUserId: string;
  toUserId: string;
  amount: number;
  bookingId: string;
  experienceId: string;
}
```