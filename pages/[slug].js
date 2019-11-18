import * as React from 'react'
import { useCMS, useCMSForm, useWatchFormValues } from 'react-tinacms'

export default function Page(props) {
  // grab the instance of the cms to access the registered git API
  let cms = useCMS()

  // add a form to the CMS; store form data in `post`
  let [post, form] = useCMSForm({
    id: props.fileRelativePath, // needs to be unique
    label: 'Edit Post',

    // starting values for the post object
    initialValues: {
      ...props.content,
    },

    // field definition
    fields: [
      {
        name: 'title',
        label: 'TItle',
        component: 'text',
        description: 'Enter the title of the post here'
      },
      {
        name: 'text',
        label: 'Text',
        component: 'text',
        description: 'Enter the text of the post here'
      },
    ],

    // save & commit the file when the "save" button is pressed
    onSubmit(data) {
      return cms.api.git
        .writeToDisk({
          fileRelativePath: props.fileRelativePath,
          content: JSON.stringify(data),
        })
        .then(() => {
          return cms.api.git.commit({
            files: [props.fileRelativePath],
            message: `Commit from Tina: Update ${props.fileRelativePath}`,
          })
        })
    },
  })

  let writeToDisk = React.useCallback(formState => {
    cms.api.git.writeToDisk({
      fileRelativePath: props.fileRelativePath,
      content: JSON.stringify(formState.values),
    })
  }, [])

  useWatchFormValues(form, writeToDisk)

  return (
    <>
      <h1>{post.title}</h1>
      <span>{post.text}</span>
    </>
  )
}

Page.getInitialProps = function (ctx) {
  const { slug } = ctx.query
  let content = require(`../posts/${slug}.json`)

  return {
    slug: slug,
    fileRelativePath: `/posts/${slug}.json`,
    content,
  }
}