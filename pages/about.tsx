import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="mt-10 flex flex-col gap-10">
      <h1 className="text-center text-3xl">About</h1>
      <p className="text-white/70">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, sed
        molestias delectus ut eos minus aut sequi soluta, magnam, ab qui quam.
        Praesentium assumenda doloribus maxime, accusamus repudiandae fugiat
        illo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus,
        sed molestias delectus ut eos minus aut sequi soluta, magnam, ab qui
        quam. Praesentium assumenda doloribus maxime, accusamus repudiandae
        fugiat illo. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Natus, sed molestias delectus ut eos minus aut sequi soluta, magnam, ab
        qui quam. Praesentium assumenda doloribus maxime, accusamus repudiandae
        fugiat illo.
      </p>
      <div className="max-w-sm mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://dummyimage.com/600x350/4b5563/ffffff&text=about"
          alt="aboutImage"
          className="h-auto rounded-lg "
        />
      </div>
      <p className="text-white/70">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, sed
        molestias delectus ut eos minus aut sequi soluta, magnam, ab qui quam.
        Praesentium assumenda doloribus maxime, accusamus repudiandae fugiat
        illo.
      </p>
      <h2 className="text-2xl text-center mb-20">whoyoux @ 2022</h2>
    </div>
  );
};

export default About;
