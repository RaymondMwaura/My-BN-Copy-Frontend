import React from 'react';
import {
	act,
	cleanup,
	fireEvent,
	waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import Cookies from 'universal-cookie';
import localStorage from '../../__mocks__/LocalStorage';
import render from '../../__mocks__/render';
import token from '../../__mocks__/token';
import { BrowserRouter } from 'react-router-dom';
import TravelDocuments from '../../components/TravelDocuments';
global.localStorage = localStorage;
jest.mock('universal-cookie');
import { fetchDocuments } from "../../lib/services/documentsService";
Cookies.mockImplementation(() => ({ get: () => token }));

jest.mock("../../lib/services/documentsService");
beforeEach(() => {
	global.localStorage.setItem("bn_user_data", `{
		"email":"requestero@user.com",
		"name":"Requester",
		"userId":2,
		"verified":true,
		"role":"requester",
		"lineManagerId":7,
		"iat":1578472431,
		"exp":1578558831
	}`);
});

afterEach(() => {
	cleanup();
	global.localStorage.clear();
	localStorage.store = {};
});

const data = {
	status: 'success',
	message: 'Documents retrieved successfully',
	data: [
		{
			id: 18,
			name: 'VISA',
			url:
				'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1582208234604-1085.jpeg',
			userId: 2,
			travelAdminId: 4,
			verified: false,
			createdAt: '2020-02-20T14:17:21.121Z',
			updatedAt: '2020-02-20T14:21:02.352Z',
			admin: { id: 4, firstName: 'travel', lastName: 'Admin' },
			documentOwner: { id: 2, firstName: 'Requester', lastName: 'User' },
		},
		{
			id: 13,
			name: 'Visa',
			url:
				'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1582042823090-flower%20%281%29.gif',
			userId: 2,
			travelAdminId: 4,
			verified: true,
			createdAt: '2020-02-18T16:20:25.976Z',
			updatedAt: '2020-02-19T13:30:53.268Z',
			admin: { id: 4, firstName: 'travel', lastName: 'Admin' },
			documentOwner: { id: 2, firstName: 'Requester', lastName: 'User' },
		},
		{
			id: 12,
			name: 'PAsport',
			url:
				'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/hotels/1582042725681-1581945960554-flower%20%283%29.gif',
			userId: 2,
			travelAdminId: 4,
			verified: true,
			createdAt: '2020-02-18T16:18:49.836Z',
			updatedAt: '2020-02-19T13:31:19.006Z',
			admin: { id: 4, firstName: 'travel', lastName: 'Admin' },
			documentOwner: { id: 2, firstName: 'Requester', lastName: 'User' },
		},
	],
};
fetchDocuments.mockImplementation(() => Promise.resolve({data: data }))
describe('Travel Documents', () => {
	test("User can view travel documents", async () => {
		const { getByText, getAllByTestId, getByTestId } = render(
			<BrowserRouter>
				<TravelDocuments />
			</BrowserRouter>
    );
    
    const [previewBtn] = await waitForElement(() => [
      getAllByTestId('preview')
    ]);

    await act( async () => {
      fireEvent.click(previewBtn[0]);
    });

    const previewIframe = getByTestId('prev-iframe');
    fireEvent.load(previewIframe);

    const [backToDocuments, deleteBtn] = await waitForElement(() => [
      getByTestId('bcktodocs'),
      getByTestId('delete'),
    ]);

    await act( async () => {
      fireEvent.click(backToDocuments);
      fireEvent.click(previewBtn[0]);
      fireEvent.click(deleteBtn);
    });

  });
  
  test("user can view, add, delete travel document", async () => {
    const { getByText, getByPlaceholderText, getByTestId, getAllByTestId } = render(
			<BrowserRouter>
				<TravelDocuments />
			</BrowserRouter>
    );
    
    const [addDoc, name, document, cancel, upload, remove] = await waitForElement(() => [
      getByText('Add Document'),
      getByPlaceholderText('E.g: VISA, Passport, etc'),
      getByTestId('document'),
      getByText('Cancel'),
      getByText('Upload'),
      getAllByTestId('delete'),
    ]);

    const file = new File(['test content'], {type : 'image/jpg'});

    await act( async () => {
      fireEvent.click(addDoc);
      fireEvent.click(cancel);
      fireEvent.click(addDoc);

      fireEvent.change(name, { target: { value: 'VISA'}});
      fireEvent.change(document, {target: {files: [file]}} );
      fireEvent.click(upload);
    });

    await act( async () => {
      fireEvent.click(remove[0]);
    });
  }) 

  test("travel admin can view, add, approve travel document", async () => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"travel_administrator",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    const { getAllByTestId } = render(
      <BrowserRouter>
        <TravelDocuments />
      </BrowserRouter>
    );
    
    const [approve] = await waitForElement(() => [
      getAllByTestId('approve'),
    ]);

    await act( async () => {
      fireEvent.click(approve[0]);
    });
  })
  
  test("travel admin can preview document and approve", async () => {
    global.localStorage.setItem("bn_user_data", `{
      "email":"requestero@user.com",
      "name":"Requester",
      "userId":2,
      "verified":true,
      "role":"travel_administrator",
      "lineManagerId":7,
      "iat":1578472431,
      "exp":1578558831
    }`);
    const { getAllByTestId, getByTestId  } = render(
      <BrowserRouter>
        <TravelDocuments />
      </BrowserRouter>
    );

    const [previewBtn] = await waitForElement(() => [
      getAllByTestId('preview')
    ]);

    await act( async () => {
      fireEvent.click(previewBtn[0]);
    });

    const [approve] = await waitForElement(() => [
      getByTestId('approve'),
    ]);

    await act( async () => {
      fireEvent.click(approve);
    });
  })
});
