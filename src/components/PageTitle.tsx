import React, { useEffect, memo } from "react";

export const withPageTitle =
  (title: string, Component: React.ComponentType) => () => {
    const Memoized = memo(Component);

    useEffect(() => {
      document.title = title;
    }, []);
    return <Memoized />;
  };
