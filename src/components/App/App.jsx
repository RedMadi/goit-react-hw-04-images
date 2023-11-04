import React, { useEffect, useState } from 'react';
import { SearchBar } from 'components/SearchBar/SearchBar';
import FetchPicturesWithQuery from 'api/PicturesApi';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Loader } from 'components/Loader/Loader';
import { LoadMoreBtn } from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { AppStyled } from './App.styled';

const App = () => {
  const [pictures, setPictures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(null);
  const [currentAlt, setCurrentAlt] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const searchValue = e.target.search.value;

    if (!searchValue) {
      console.log('Enter some query to find');
      return;
    }
    if (query !== searchValue) {
      setQuery(searchValue);
      setPage(1);
      setPictures([]);
      e.target.reset();
    } else {
      console.log(`You already queried a ${query}`);
      e.target.reset();
    }
  };
  useEffect(() => {
    async function handleFetchPicturesWithQuery() {
      try {
        setIsLoading(true);
        const { hits, totalHits } = await FetchPicturesWithQuery(page, query);
        if (!totalHits) {
          console.log('No results by your query');
          setIsLoading(false);
          return;
        }
        setPictures(prev => [...prev, ...hits]);
        setLoadMore(page < Math.ceil(totalHits / 12));
      } catch (error) {
        // setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (page !== 1 || query !== '') {
      setIsLoading(true);
      handleFetchPicturesWithQuery();
    }
  }, [page, query]);

  const handleLoadMore = () => {
    if (loadMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleOpenModal = (img, alt) => {
    setModalOpen(prev => !prev);
    setCurrentImg(img);
    setCurrentAlt(alt);
  };

  return (
    <AppStyled>
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      <ImageGallery pictures={pictures} handleOpenModal={handleOpenModal} />
      {pictures.length > 0 && loadMore && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}

      {modalOpen && (
        <Modal
          closeModal={handleOpenModal}
          currentAlt={currentAlt}
          currentImg={currentImg}
        />
      )}
    </AppStyled>
  );
};

export default App;
