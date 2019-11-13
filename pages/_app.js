import React from 'react'
import App from 'next/app'
import { Tina, TinaCMS } from 'tinacms'
import { GitClient } from '@tinacms/git-client'

class MyApp extends App {
    constructor() {
        super()
        this.cms = new TinaCMS()
        this.cms.registerApi('git', new GitClient('http://localhost:3001/___tina'))
    }

    render() {
        const { Component, pageProps } = this.props
        return <Tina cms={this.cms} position={"fixed"}>
            <Component {...pageProps} />
        </Tina>
    }
}

export default MyApp
