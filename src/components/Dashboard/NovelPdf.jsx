import { useTranslation } from "react-i18next";
import pdfFile from "../../assets/sample.pdf";
import { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { RateNovel } from ".";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const NovelPdf = ({ card, HandleBackClick }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const navigateToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showRate, setShowRate] = useState(false);

  const handleRateClick = () => {
    setShowRate(true);
  };

  const handleHideRate = () => {
    setShowRate(false);
  };
  useEffect(() => {
    const handleBrowserBackButton = () => {
      HandleBackClick();
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handleBrowserBackButton);

    return () => {
      window.removeEventListener("popstate", handleBrowserBackButton);
    };
  }, [HandleBackClick]);

  return (
    <>
      {showRate && (
        <RateNovel NovelId={card.id} HandleHideRate={handleHideRate} />
      )}
      <div className="novel-pdf">
        <button
          onClick={() => {
            handleRateClick();
          }}
          className="mobile-rate-button"
        >
          {t("Rate")}
        </button>
        <div className="navigater">
          <button
            onClick={() => {
              handleRateClick();
            }}
          >
            {t("Rate")}
          </button>
          <div className="novel-pdf-title">
            <h4>{t("Now Reading")}</h4>
            <h4 className="title">{card.title}</h4>
          </div>
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              className="thumbnail"
              onClick={() => navigateToPage(index + 1)}
            >
              <div className="overlay"></div>
              <Document file={pdfFile}>
                <Page pageNumber={index + 1} width={80} />
              </Document>
              <div className="page-number">{`${index + 1}/${numPages}`}</div>
            </div>
          ))}
        </div>
        <div className="pdf-controls">
        <button onClick={()=>{navigateToPage(currentPage-1)}} disabled={currentPage === 1}>
          {t('Previous')}
        </button>
        <span>
           {currentPage} / {numPages}
        </span>
        <button onClick={()=>{navigateToPage(currentPage+1)}} disabled={currentPage === numPages}>
          {t('Next')}
        </button>
      </div>
        <div className="pdf-container">
          <Document onLoadSuccess={onDocumentLoadSuccess} file={pdfFile}>
            <Page pageNumber={currentPage} />
          </Document>
        </div>
      </div>
    </>
  );
};
