import { ReactNode, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

function NetworkListener() {
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      onlineManager.setOnline(
        !!state.isConnected && !!state.isInternetReachable,
      );
    });
  }, []);

  return null;
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: (failureCount, error) => {
              if (
                error instanceof Error &&
                error.message.includes("Network request failed")
              ) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <NetworkListener />
        {children}
      </>
    </QueryClientProvider>
  );
}
