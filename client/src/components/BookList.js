import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { getBooksQuery } from '../queries/queries';
import BookDetails from '../components/BookDetails';

const DisplayBooks = ({ data, setSelectedBook }) => {
	if (data.loading) {
		return <div>Loading .....</div>;
	}
	return (
		<ul className='book-list'>
			{data.books.map(book => (
				<li key={book.id} onClick={e => setSelectedBook(book.id)}>
					{book.name}
				</li>
			))}
		</ul>
	);
};

const BookList = ({ data }) => {
	const [selectedBook, setSelectedBook] = useState('');
	return (
		<div>
			<DisplayBooks data={data} setSelectedBook={setSelectedBook} />
			<BookDetails selectedBook={selectedBook} />
		</div>
	);
};

BookList.propTypes = {
	data: PropTypes.object.isRequired,
};

export default graphql(getBooksQuery)(BookList);
