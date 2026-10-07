import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Loader2, FileSpreadsheet } from 'lucide-react';
import { RawReview } from '@/lib/types';
import { parseReviewFile } from '@/lib/csv-parser';

interface FileUploadProps {
  onStartAnalysis: (reviews: RawReview[]) => void;
  isLoading: boolean;
}

export default function FileUpload({ onStartAnalysis, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedReviews, setParsedReviews] = useState<RawReview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    const isCsv = lowerName.endsWith('.csv');
    const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

    if (!isCsv && !isExcel) {
      setErrors(['CSV 또는 엑셀(.xlsx, .xls) 형식의 파일만 업로드할 수 있습니다.']);
      return;
    }

    setIsParsing(true);
    setErrors([]);
    setSelectedFileName(file.name);

    try {
      const result = await parseReviewFile(file);

      if (!result.success && result.reviews.length === 0) {
        setErrors(result.errors.length > 0 ? result.errors : ['유효한 리뷰 데이터를 파싱할 수 없습니다.']);
        setParsedReviews([]);
      } else {
        setParsedReviews(result.reviews);
        if (result.errors.length > 0) {
          setErrors(result.errors);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '파일을 읽는 도중 오류가 발생했습니다.';
      setErrors([message]);
      setParsedReviews([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const isExcelFile = selectedFileName?.toLowerCase().endsWith('.xlsx') || selectedFileName?.toLowerCase().endsWith('.xls');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">리뷰 파일 업로드</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              CSV &amp; 엑셀 지원
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            정기 분석할 CSV 또는 엑셀(.xlsx, .xls) 파일을 드래그하거나 선택해 주세요. (컬럼: 번호, 작성일, 별점, 리뷰)
          </p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading || isParsing}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {isParsing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              CSV 또는 엑셀(.xlsx) 파일을 드래그하여 놓거나{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isParsing}
                className="text-blue-600 hover:text-blue-700 underline font-semibold disabled:text-slate-400"
              >
                내 컴퓨터에서 찾기
              </button>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              별도의 CSV 변환 없이 쇼핑몰에서 다운로드한 엑셀 원본 그대로 업로드하셔도 바로 분석됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Selected file information */}
      {selectedFileName && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isExcelFile ? (
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{selectedFileName}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                  {isExcelFile ? 'Excel' : 'CSV'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                파싱 완료된 유효 리뷰:{' '}
                <strong className="text-slate-800">{parsedReviews.length}건</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartAnalysis(parsedReviews)}
            disabled={isLoading || parsedReviews.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gemini AI 일괄 분석 중...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {parsedReviews.length}건 정기 분석 시작
              </>
            )}
          </button>
        </div>
      )}

      {/* Parsing errors or warnings */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-semibold">파일 파싱 확인 사항 ({errors.length}건):</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-700 max-h-24 overflow-y-auto">
                {errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {errors.length > 5 && <li>그 외 {errors.length - 5}건 생략...</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
