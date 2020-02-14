import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

import { Dropdown, Card, Icon, Button } from 'semantic-ui-react'
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
      <div className="buttonGroup">
        {
          (repositories.length < 30 && pageNum < 2) || pageNum < 2 ? null : 
            <Button animated onClick = {() => setPageNum(pageNum - 1)}>
              <Button.Content visible>PREV</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow left' />
              </Button.Content>
            </Button>
        }
        {
          (repositories.length < 30) ? null :
            <Button animated onClick = {() => setPageNum(pageNum + 1)}>
              <Button.Content visible>NEXT</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
        } 
      </div>
      <Card.Group className = 'cardGroup'>
        {repositories.map(repo => (
          <Card key = {repo.id} href = {repo.html_url} target = '_blank'>
            <Card.Content header = {repo.name} />
            <Card.Content meta = {repo.full_name} />
            <Card.Content description = {`Owner: ${repo.owner.login}`} />
            <Card.Content extra>
              <Icon name='user' /> {repo.watchers_count}
              <Icon name='star' />{repo.stargazers_count} 
              <Icon name='fork' />{repo.forks} 
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </section>
    <Footer />
    </>
  );
}

export default App;
