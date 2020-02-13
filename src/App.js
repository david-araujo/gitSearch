import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Card from './components/Card';

function App() {
  
  const [languages, setLanguages] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [language, setLanguage] = useState('');
  const [pageNum, setPageNum] = useState(1);

  const getLanguages = async () => {
    const response = await fetch('https://api.github.com/languages');
    const data = await response.json();

    setLanguages(data);
  }
  
  const getRepositories = useCallback(
    async () => {
      const response = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&page=${pageNum}`)
      const data = await response.json();

      setRepositories(language ? data.items : [])
    }, [language, pageNum]
  );

  useEffect(() => {  
    getLanguages();
  }, []);

  useEffect(() => {
    getRepositories()
  }, [getRepositories, language, pageNum]);


  return (
    <div className="App">
      <select onChange = {(e) => {setLanguage(e.target.value); setPageNum(1)}}>
        <option value = ''>Selecione uma Linguagem</option>
        {languages.map(lang => (
          <option key = {lang.name} value = {lang.name}>{lang.name}</option>
        ))}
      </select>
      <ul>
        {repositories.map(repo => (
          <li key = {repo.id}>{repo.name}</li>
        ))}
      </ul>
      <button onClick = {() => setPageNum(pageNum - 1)}>PREV</button>
      <button onClick = {() => setPageNum(pageNum + 1)}>NEXT</button>
    </div>
  );
}

export default App;
