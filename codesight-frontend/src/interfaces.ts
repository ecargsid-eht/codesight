export interface User{
    name:string;
    email: string;
    profileImage: string;
    clerkId: string;

}

export interface Session {
    _id: string;
    problem: string;
    difficulty: string;
    host: User;
    participant?: User;
    status: 'active' | 'ended';
    callId: string;
    createdAt: string;
    updatedAt: string;
}

