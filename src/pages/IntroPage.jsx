import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

export default function IntroPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center px-32 py-16 w-full text-black_default">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-5xl font-bold mb-6 leading-tight w-full">
          나만의 키워드,
          <br />
          <span className="text-blue-200 text-5xl">[</span>Stockey<span className="text-blue-200 text-5xl">]</span>로
          주식을 열어보세요
        </h2>
        <p className="text-lg font-semibold mb-2">키워드를 통해 주식에 대한 인사이트를 얻고,</p>
        <p className="text-lg mb-8 font-semibold">관심 있는 종목의 트렌드를 한눈에 파악하세요</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-200 text-white font-semibold py-4 rounded-xl text-xl hover:bg-blue-100 transition-colors duration-200"
          onClick={() => {
            navigate('/home');
          }}
        >
          시작하기
        </motion.button>
      </motion.div>
      <div
        className="fixed inset-0 z-[-1] animate-fadeIn"
        style={{
          background: 'radial-gradient(circle, #BED1FF 0%, #E9EFFF 50%, white 100%)',
        }}
      />
    </div>
  );
}
