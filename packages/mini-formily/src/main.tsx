import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client'

// import { createForm } from '@formily/core'
// import { FormProvider, Field } from '@formily/react'
// import { FormItem, Input } from '@formily/antd'

import { createForm } from '../packages/core'
import { FormProvider, Field } from '../packages/react'
import { FormItem, Input } from '../packages/antd'

import 'antd/dist/antd.css'

const App = () => {
  const form = useMemo(() => createForm(), [])

  return (
    <FormProvider form={form}>
      <Field
        name="name"
        title="用户名"
        value="小明"
        decorator={[FormItem]}
        component={[Input]}
      />
      <button onClick={() => {form.submit(console.log)}}>提交</button>
    </FormProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />);