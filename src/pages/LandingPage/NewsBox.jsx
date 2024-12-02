import React, { useState, useEffect } from 'react';
import newsApi from '../../services/newsApi';
import Card from 'react-bootstrap/Card';
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css';

export default function NewsBox() {
  const [newsList, setNewsList] = useState([]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      const resp = await newsApi.getNews();
      setNewsList(resp.data);
      console.log(resp.data);
    };
    fetchNews();
  }, []);

  return (
    <div className="mt-4">
      <ScrollContainer className="flex flex-row gap-4 overflow-x-scroll" style={{ padding: '1rem', width: '100%' }}>
        {newsList.map((elem, index) => (
          <a
            key={index}
            href={elem.newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
            draggable={false}
          >
            <Card
              key={index}
              className="border-2 rounded-xl border-gray-200"
              style={{ width: '16rem', height: '19rem', flex: '0 0 auto' }}
            >
              <Card.Img
                variant="top"
                src={elem.newsThumbUrl}
                className="p-2"
                style={{ height: '12rem', objectFit: 'cover', pointerEvents: 'none' }}
                draggable={false} // 이미지 드래그 비활성화
              />
              <Card.Body className="pt-1 px-2.5">
                <div className="flex flex-row items-center mb-1">
                  <img
                    src={elem.newsCompanyThumbUrl}
                    style={{ width: '1rem', height: '1rem' }}
                    className="mr-1"
                    draggable={false} // 로고 드래그 비활성화
                  />
                  <Card.Title style={{ marginBottom: '0px' }} className="text-xs text-gray-600">
                    {elem.newsCompany}
                  </Card.Title>
                </div>
                <Card.Text className="font-bold text-gray-700">{elem.title}</Card.Text>
              </Card.Body>
            </Card>
          </a>
        ))}
      </ScrollContainer>
    </div>
  );
}
