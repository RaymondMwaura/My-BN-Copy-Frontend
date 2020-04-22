import React, { useRef, useEffect, useState } from 'react';
import useChat from '../../helpers/UseChat';
import { formatToTime } from '../../lib/time';

function Chat() {
	const { messages, sendMessage, getPriorMessages } = useChat();
	const messagesEndRef = useRef(null);
	const [newMessage, setMessage] = useState('');
	const [showChat, setShowChat] = useState(false);
	const scrollToBottom = () => {
		const el = window.$('#chat');
		const height = el[0].scrollHeight;
		el.scrollTop(height);
	};
	const toggle = () => {
		setShowChat(!showChat);
		scrollToBottom();
	};
	const { userId, name } = JSON.parse(localStorage.bn_user_data);

	useEffect(() => {
		getPriorMessages();
	}, []);

	const handleChange = event => {
		const { value } = event.target;
		setMessage(value);
	};
	const submitMessage = event => {
		event.preventDefault();
		if (newMessage.trim()) {
			sendMessage({ message: newMessage });
			setMessage('');
		}
	};
	useEffect(scrollToBottom, [messages]);

	return (
		<div>
			<div className='fabs'>
				<div className={showChat ? 'chat' : 'chat hide'}>
					<div className='chat_header'>
						<div className='chat_option'>
							<span id='chat_header'>Barefoot Chat</span>
							<br />
							<span className='agent'>{name}</span>
							<span className='online'>(Online)</span>
						</div>
					</div>
					<div id='chat_body' className='chat_body'>
						<div id='chat_fullscreen' className='chat_conversion chat_converse'>
							<ul ref={messagesEndRef} id='chat'>
								{messages &&
									messages.map(message => {
										if (message.userId === userId) {
											return (
												<li key={message.id} className='me'>
													<div className='box'>
														<span className='status blue' />
													</div>
													<div className='message'>
														<h2>me:</h2>
														<div>{message.message}</div>
													</div>
													<small>
														{`sent ${formatToTime(message.timestamp)}`}
													</small>
												</li>
											);
										}
										return (
											<li key={message.id} className='you'>
												<div className='box'>
													<span className='status green' />
												</div>
												<div className='message'>
													<h2>{`${message.username}:`}</h2>
													<div>{message.message}</div>
												</div>
												<small>
													{`sent ${formatToTime(message.timestamp)}`}
												</small>
											</li>
										);
									})}
							</ul>
							<div id='lastScroll' />
						</div>
						<div className='fab_field'>
							<form onSubmit={event => submitMessage(event)} noValidate>
								<button
									type='submit'
									id='fab_send'
									className='fab'
									data-testid='sendMessage'
									data-toggle='tooltip'
									value={newMessage}
									data-placement='top'
									title='Press to send message'
									data-delay='0'
								>
									<i className='fa fa-paper-plane' />
								</button>
								<textarea
									id='chatSend'
									data-testid='txtMessage'
									name='chat_message'
									value={newMessage}
									onChange={event => handleChange(event)}
									placeholder='Send a message'
									className='chat_field chat_message'
									required
								/>
							</form>
						</div>
					</div>
				</div>
				<button
					type='button'
					data-testid='toggle-chat-box'
					onClick={() => toggle()}
					className='fab'
				>
					{showChat ? (
						<i className='fa fa-times is-active' aria-hidden='true' />
					) : (
						<i className='fa fa-comments' aria-hidden='true' />
					)}
				</button>
			</div>
		</div>
	);
}

export default Chat;
