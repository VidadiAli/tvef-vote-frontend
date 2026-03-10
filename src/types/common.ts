export type SemiFinalType = "s1" | "s2" | "s3" | "s4" | "s5" | "final";

export interface ApiResponseState {
  open: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}