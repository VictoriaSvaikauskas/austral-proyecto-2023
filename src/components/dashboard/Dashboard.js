import { useContext, useEffect, useState } from "react";

import NewBook from "../NewBook/NewBook";
import BooksFilter from "../bookFilter/BookFilter";
import Books from "../books/Books";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import ToggleTheme from "../toggleTheme/ToggleTheme";
// const BOOKS = [
//   {
//     id: 1,
//     title: "100 años de soledad",
//     author: "Gabriel García Marquez",
//     dateRead: new Date(2021, 8, 12),
//     pageCount: 410,
//   },
//   {
//     id: 2,
//     title: "Todos los fuegos el fuego",
//     author: "Julio Cortazar",
//     dateRead: new Date(2020, 6, 11),
//     pageCount: 197,
//   },
//   {
//     id: 3,
//     title: "Asesinato en el Orient Express",
//     author: "Agatha Christie",
//     dateRead: new Date(2021, 5, 9),
//     pageCount: 256,
//   },
//   {
//     id: 4,
//     title: "Las dos torres",
//     author: "J.R.R Tolkien",
//     dateRead: new Date(2020, 3, 22),
//     pageCount: 352,
//   },
// ];

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [yearFiltered, setYearFiltered] = useState("Seleccione un año");

  const { handleLogout, user } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const username = user?.email.split("@")[0];

  useEffect(() => {
    fetch("http://localhost:8080/book/traertodoslosbook", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((bookData) => {
        const booksMapped = bookData.map((book) => ({
          id: book.id,
          title: book.bookTitle,
          author: book.author,
          dateRead: new Date(book.date),
          pageCount: book.amountPages,
        }));
        setBooks(booksMapped);
      })
      .catch((error) => console.log(error));
  }, []);

  const addBookHandler = (book) => {
    const dateString = book.dateRead.toISOString().slice(0, 10);

    fetch("http://localhost:8080/book/crear", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        bookTitle: book.title,
        date: dateString,
        amountPages: parseInt(book.pageCount, 10),
        author: book.author
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          throw new Error("The response had some errors");
        }
      })
      .then(() => {
        const newBooksArray = [book, ...books];
        setBooks(newBooksArray);
      })
      .catch((error) => console.log(error));

    // const newBooksData = [book, ...books];
    // setBooks(newBooksData);
    // localStorage.setItem("books", JSON.stringify(newBooksData));
  };

  const handleFilterChange = (year) => {
    setYearFiltered(year);
  };

  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <>
      <Row>
        <Col>
          <h1>Books Champion App!</h1>
          <h3>¡Quiero leer libros!</h3>
          <p>Bienvenido {username}</p>
        </Col>
        <Col className="d-flex justify-content-end">
          <ToggleTheme />
          <Button
            size="lg"
            variant="primary"
            className="m-3"
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </Col>
      </Row>
      <NewBook onBookAdded={addBookHandler} />
      <BooksFilter
        yearFiltered={yearFiltered}
        onYearChange={handleFilterChange}
      />
      <Books yearFiltered={yearFiltered} books={books} />
    </>
  );
};

export default Dashboard;
