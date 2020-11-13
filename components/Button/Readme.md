Basic button:

```jsx
<Button>Push Me</Button>
```

Big pink button:

```jsx
<Button size="large" color="deeppink">
  Click Me
</Button>
```

And you _can_ **use** `any` [Markdown](http://daringfireball.net/projects/markdown/) here.

Fenced code blocks with `js`, `jsx` or `javascript` languages are rendered as a interactive playgrounds:

```jsx
<Button>Push Me</Button>
```

Add padding between examples in a block by passing a `padded` modifier (` ```jsx padded `):

```jsx padded
<Button>Push Me</Button>
<Button>Click Me</Button>
<Button>Tap Me</Button>
```

You can add a custom props to an example wrapper (` ```js { "props": { "className": "checks" } } `):

```js { "props": { "className": "checks" } }
<Button>I’m transparent!</Button>
```

Or disable an editor by passing a `noeditor` modifier (` ```js noeditor `):

```jsx noeditor
<Button>Push Me</Button>
```

To render an example as highlighted source code add a `static` modifier: (` ```js static `):

```js static
import React from 'react'
```

Fenced blocks with other languages are rendered as highlighted code:

```html
<h1>Hello world</h1>
```

Current component (like `Button` in this example) is always accessible by its name in the example code. If you want to use other components, you need to explicitly import them:

```jsx
import Lazyload from '../Lazyload';
<>
  <Button>button</Button>
  <br/>
  <Lazyload 
    styles={{width:"100px",height:"100px"}}
    src='https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2102578530,3462366934&fm=26&gp=0.jpg' 
    />
</>
```

Each example's state can be accessed by React hook `useState`:


```jsx
import React from 'react'
const [isOpen, setisOpen] = React.useState(false)
;<div>
  <Button
    size="small"
    onClick={() => setisOpen(true)}
    disabled={isOpen}
  >
    Show Me
  </Button>
  {isOpen && (
    <Button size="small" onClick={() => setisOpen(false)}>
      Hide Me
    </Button>
  )}
</div>
```

You can change the default state:

```jsx
const [count, setCount] = React.useState(42)
;<Button onClick={() => setCount(count + 1)}>{count}</Button>
```

