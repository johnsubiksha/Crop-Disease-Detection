/**
 * usePrediction.js — Custom hook managing the full prediction lifecycle
 */

import { useState, useCallback } from 'react'
import { predictDisease } from '../utils/api'

export const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PREDICTING: 'predicting',
  SUCCESS: 'success',
  ERROR: 'error',
}

const initialState = {
  status: STATUS.IDLE,
  result: null,
  error: null,
  uploadProgress: 0,
}

export function usePrediction() {
  const [state, setState] = useState(initialState)

  const predict = useCallback(async (file) => {

    if (!file) return

    setState({

        status: STATUS.UPLOADING,

        result: null,

        error: null,

        uploadProgress: 0
    })

    try {

        const formData = new FormData()

        formData.append("file", file)

        const result = await predictDisease(

            formData
        )

        setState({

            status: STATUS.SUCCESS,

            result,

            error: null,

            uploadProgress: 100
        })

    } catch (err) {

        console.log(err)

        setState({

            status: STATUS.ERROR,

            result: null,

            error: err.message,

            uploadProgress: 0
        })
    }

}, [])

  const reset = useCallback(() => setState(initialState), [])

  return { ...state, predict, reset }
}
