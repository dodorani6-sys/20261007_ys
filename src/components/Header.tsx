import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                하루살림 마케팅팀
              </span>
              <span className="text-xs text-slate-500 font-medium">정기 분석 체계</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              무선 청소기 「클린핏 미니」 정기 리뷰 분석기
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Gemini 기반 일괄 감성·유형 분류 및 한국소비자원 공식 위해 접수 데이터 교차 검증 대시보드
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>표준화된 정기 분석 &amp; DB 이력 누적</span>
          </div>
        </div>
      </div>
    </header>
  );
}
