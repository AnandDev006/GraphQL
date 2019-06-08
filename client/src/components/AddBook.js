import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import {
	getBooksQuery,
	getAuthorsQuery,
	addBookMutation,
} from '../queries/queries';

const DisplayAuthors = ({ data }) => {
	if (data.loading) {
		return <option disabled>Select author</option>;
	}
	return (
		<React.Fragment>
			{data.authors.map(author => (
				<option key={author.id} value={author.id}>
					{author.name}
				</option>
			))}
		</React.Fragment>
	);
};

const AddBook = ({ getAuthorsQuery, addBookMutation }) => {
	const [bookName, setBookName] = useState('');
	const [genre, setGenre] = useState('');
	const [authorId, setAuthorId] = useState('');

	const resetForm = () => {
		setBookName('');
		setGenre('');
		setAuthorId('');
	};

	const submitForm = event => {
		event.preventDefault();
		addBookMutation({
			variables: {
				name: bookName,
				genre,
				authorId,
			},
			refetchQueries: [{ query: getBooksQuery }],
		});
		resetForm();
	};

	return (
		<form className='add-book' onSubmit={submitForm}>
			<div className='field'>
				<label>Book name:</label>
				<input
					type='text'
					value={bookName}
					onChange={({ target }) => setBookName(target.value)}
				/>
			</div>
			<div className='field'>
				<label>Genre:</label>
				<input
					type='text'
					value={genre}
					onChange={({ target }) => setGenre(target.value)}
				/>
			</div>
			<div className='field'>
				<label>Author:</label>
				<select onChange={({ target }) => setAuthorId(target.value)}>
					<option value=''>Select author</option>
					<DisplayAuthors data={getAuthorsQuery} />
				</select>
			</div>
			<button>+</button>
		</form>
	);
};

AddBook.propTypes = {
	getAuthorsQuery: PropTypes.object.isRequired,
};

export default compose(
	graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
	graphql(addBookMutation, { name: 'addBookMutation' })
)(AddBook);
