import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchKeywordInput from './SearchKeywordInput';
import { searchKeyword } from '../utils/keywordFunction';

function KeywordSearchModal({ show, handleClose }) {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = () => {
    searchKeyword(search, setSearchResult);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} className="font-sans p-5">
        <Modal.Body closeButton>
          <div className="min-h-40 flex flex-col justify-center items-center">
            <div className="text-lg text-center font-semibold mb-3">
              주식 종목 랭킹을 확인하고자 하는 <span className="text-blue-200">키워드</span>를 검색해 주세요
            </div>
            <SearchKeywordInput
              setSearch={setSearch}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              searchKeyword={handleSearch}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className=" bg-blue-200 border-none hover:bg-blue-100" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KeywordSearchModal;
