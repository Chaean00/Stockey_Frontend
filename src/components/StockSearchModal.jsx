import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchInput from './SearchInput';
import { searchStock } from '../utils/stockFunction';

function StockSearchModal({ show, setShow }) {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleSearch = () => {
    searchStock(search, setSearchResult);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        className="font-sans p-5"
      >
        <Modal.Body closeButton>
          <div className="min-h-40 flex flex-col justify-center items-center">
            <div className="text-lg text-center font-semibold mb-3">
              키워드 랭킹을 확인하고자 하는 <span className="text-blue-200">종목</span>을 검색해 주세요
            </div>
            <SearchInput
              setSearch={setSearch}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              searchStock={handleSearch}
              setShow={setShow}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className=" bg-blue-200 border-none hover:bg-blue-100"
            onClick={() => {
              setShow(false);
            }}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StockSearchModal;
