import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()

    axios('/foo', { onDownloadProgress: progressSpy })

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })
      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()

    axios('/foo', { onUploadProgress: progressSpy })

    return getAjaxRequest().then(request => {
      // Jasmine AJAX doesn't trigger upload events. Waiting for jest-ajax fix
      // expect(progressSpy).toHaveBeenCalled()
    })
  })
})
