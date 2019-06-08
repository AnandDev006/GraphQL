import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { getBookQuery } from '../queries/queries';

const DisplayBookDetails = ({ data }) => {
	const { book } = data;
	if (book) {
		return (
			<div>
				<h2>{book.name}</h2>
				<p>{book.genre}</p>
				<p>{book.author.name}</p>
				<p>All books by this author : </p>
				<ul className='other-books'>
					{book.author.books.map(book => (
						<li key={book.id}>{book.name}</li>
					))}
				</ul>
			</div>
		);
	}
	return <div>No books selected</div>;
};

const BookDetails = ({ selectedBook, data }) => {
	return (
		<div className='book-details'>
			<DisplayBookDetails data={data} />
		</div>
	);
};

BookDetails.propTypes = {
	data: PropTypes.object.isRequired,
};

export default graphql(getBookQuery, {
	options: ({ selectedBook }) => ({
		variables: { id: selectedBook },
	}),
})(BookDetails);
