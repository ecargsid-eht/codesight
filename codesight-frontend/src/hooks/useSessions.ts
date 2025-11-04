import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
    const result = useMutation({
        mutationFn: sessionApi.createSession,
        onSuccess: () => {
            toast.success("Session created successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to create session");
        }
    });
    return result;
}

export const usePastSessions = () => {
    const result = useQuery({
        queryKey: ['pastSessions'],
        queryFn: sessionApi.getPastSessions,
    });
    return result;
}

export const useSessionById = (id:string) => {
    const result = useQuery({
        queryKey: ['sessionById', id],
        queryFn: () => sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000,
    });
    return result;
}

export const useJoinSession = () => {
    const result = useMutation({
        mutationKey:["joinSession"],
        mutationFn: sessionApi.joinSession,
        onSuccess: () => {
            toast.success("Joined session successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to join session");
        }
    });
    return result;
}

export const useEndSession = () => {
    const result = useMutation({
        mutationKey:["endSession"],
        mutationFn: sessionApi.endSession,
        onSuccess: () => {
            toast.success("Ended session successfully");
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to end session");
        }
    });
    return result;
}

export const useActiveSessions = () => {
    console.log("useActiveSessions called");
    const result = useQuery({
        queryKey: ['activeSessions'],
        queryFn: () => sessionApi.getActiveSessions(),
    })
    console.log(result, "REST")
    return result;
}
