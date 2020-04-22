import { LOADING, FETCH_DOCUMENTS_SUCCESS } from './types';
import {
	fetchDocuments,
	uploadDocument,
  verifyDocument,
  deleteDocument,
} from '../../lib/services/documentsService';
import actionFunc from '../../utils/actionFunc';
import Toast from '../../lib/toast';

export const getDocuments = () => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	const res = await fetchDocuments();
	dispatch(actionFunc(FETCH_DOCUMENTS_SUCCESS, res.data.data));
	dispatch(actionFunc(LOADING, false));
};

export const addDocument = data => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	await uploadDocument(data);
	const documents = await fetchDocuments();
	dispatch(actionFunc(FETCH_DOCUMENTS_SUCCESS, documents.data.data));
	dispatch(actionFunc(LOADING, false));
};

export const approveDocument = id => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	await verifyDocument(id);
	const documents = await fetchDocuments();
	dispatch(actionFunc(FETCH_DOCUMENTS_SUCCESS, documents.data.data));
	dispatch(actionFunc(LOADING, false));
	Toast('success', 'Document verified successfully');
};

export const removeDocument = id => async dispatch => {
	dispatch(actionFunc(LOADING, true));
	await deleteDocument(id);
	const documents = await fetchDocuments();
	dispatch(actionFunc(FETCH_DOCUMENTS_SUCCESS, documents.data.data));
	dispatch(actionFunc(LOADING, false));
	Toast('success', 'Document deleted successfully');
};
