import { useRouter } from "next/router";
import { useEffect } from "react";

export const useBeforeUnload = (message: string) => {
  const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    event.returnValue = message;
  };
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        if (!window.confirm(message)) {
          throw "Abort page route";
        }
      }
      return true;
    });
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      router.beforePopState(() => true);
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [router]);
};