import React from "react";
import Head from "next/head";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative animate-pulse">
      <Head>
        <title>Facebook</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="relative w-32 h-32">
          <Image
            src="/assets/facebook-loader.webp"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <p className="absolute bottom-24 font-semibold left-1/2 -translate-x-1/2">
        From
      </p>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="relative w-24 h-24">
          <Image src="/assets/meta.png" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
