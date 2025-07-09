import { Navigate } from "react-router-dom";
import type { User } from "../types/User";

interface Props {
    children: React.ReactNode;
    user: User | undefined;
}

export default function ProtectedRoute(props: Props) {
    return props.user && props.user.admin ? props.children : <Navigate to="/login" replace />
}