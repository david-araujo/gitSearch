import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

function App() {
  
  const [languages, setLanguages] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [language, setLanguage] = useState('');
  const [pageNum, setPageNum] = useState(1);

  const getLanguages = async () => {
    const response = await fetch('https://api.github.com/languages');
    const data = await response.json();

    const list = data.reduce((acc, currentValue) => {
      let alias = currentValue.aliases[0].replace('#', 'sharp')
      acc.push({key: alias, value: alias, text: currentValue.name})
      return acc
    }, [])

    setLanguages(list);
  }
  
  const getRepositories = useCallback(
    async () => {
      console.log(typeof language)
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
    <>
    <Header />
    <section className="App">
      <Dropdown 
        placeholder = 'Selecione uma Linguagem'
        search
        selection 
        options = {languages} 
        onChange = 
        {
          (e, target) => {
            setLanguage(target.value)
            setPageNum(1)
          }
        } 
      />
      <ul>
        {repositories.map(repo => (
          <li key = {repo.id}>
            {repo.name}
          </li>
        ))}
      </ul>
      {(repositories.length < 30 && pageNum < 2) || pageNum < 2 ? null : <button onClick = {() => setPageNum(pageNum - 1)}>PREV</button> }
      {(repositories.length < 30) ? null : <button onClick = {() => setPageNum(pageNum + 1)}>NEXT</button> }
    </section>
    <Footer />
    </>
  );
}

export default App;
