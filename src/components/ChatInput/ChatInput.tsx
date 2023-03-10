import Loader from '@components/Loader/Loader'
import { FetchStatus } from '@enums/fetchStatus.enum'
import {
  selectChats,
  selectCurrentChatId,
  selectFetchStatus,
} from '@redux/chats/chatsSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { selectTheme } from '@redux/ui/uiSlice'
import { useEffect, useState } from 'react'
import sendLight from '@assets/send-light.svg'
import sendDark from '@assets/send-dark.svg'
import { Role } from '@models/chat.model'
import { fetchResponse } from '@redux/chats/chatsAsyncThunks'

export enum ChatInputTestIds {
  Container = 'chat-input-container',
  Textarea = 'chat-input-textarea',
  SendButton = 'chat-input-send-button',
}

const ChatInput = () => {
  const dispatch = useAppDispatch()

  const chats = useAppSelector(selectChats)
  const currentChatId = useAppSelector(selectCurrentChatId)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const currentTheme = useAppSelector(selectTheme)
  const fetchStatus = useAppSelector(selectFetchStatus)

  const [textareaValue, setTextareaValue] = useState('')
  const [sendNewMessage, setSendNewMessage] = useState('')

  useEffect(() => {
    if (!currentChat || !sendNewMessage) return
    dispatch(fetchResponse(currentChat.messages))
  }, [sendNewMessage])

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextareaValue(event.target.value)
  }

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!textareaValue) return
    dispatch({
      type: 'chats/addMessage',
      payload: {
        role: Role.USER,
        content: textareaValue,
      },
    })
    setSendNewMessage(textareaValue)
    setTextareaValue('')
  }

  return (
    <div
      data-testid={ChatInputTestIds.Container}
      className="flex px-4 py-6 w-full justify-center"
    >
      <div className="flex gap-4 w-[90ch]">
        <textarea
          data-testid={ChatInputTestIds.Textarea}
          id="messageInput"
          className="resize-none w-full focus:outline-none p-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
          placeholder="Type your message here..."
          value={textareaValue}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
        />
        {fetchStatus === FetchStatus.LOADING && <Loader />}
        {fetchStatus === FetchStatus.FAILED ||
          (fetchStatus === FetchStatus.IDLE && (
            <button
              data-testid={ChatInputTestIds.SendButton}
              className="p-1"
              onClick={handleSendMessage}
            >
              <img
                className="w-10 h-10"
                src={currentTheme === 'light' ? sendLight : sendDark}
                alt="send"
              />
            </button>
          ))}
      </div>
    </div>
  )
}

export default ChatInput
