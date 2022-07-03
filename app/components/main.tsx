import * as React from "react";

export const Main: React.FC<{}> = ({ children }) => {
  return (
    <main className="drop-shadow-solid relative mt-12 flex justify-center p-4 text-center text-3xl sm:mt-24 sm:text-5xl">
      <div className="w-11/12 border-2 border-black shadow-solid sm:w-4/5">
        <div className="bg-solitaire-50 p-4 pb-8">{children}</div>
      </div>
    </main>
  );
};
