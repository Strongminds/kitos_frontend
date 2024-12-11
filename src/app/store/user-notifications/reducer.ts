import { createEntityAdapter } from "@ngrx/entity";
import { NotificationState } from "./state";

export const notificationsAdapter = createEntityAdapter<NotificationState>();
