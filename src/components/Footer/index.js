import React from 'react'
import './Footer.css'

export default () => {
    const year = new Date().getFullYear()

    return <footer>
                <p>David Araujo - Fullstack Developer <span>{year}</span></p>
            </footer>
}