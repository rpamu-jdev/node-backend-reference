// src/soap/bookService.js
import soap from "soap";

// ✅ In-memory books for SOAP demo
let books = [
  { id: 1, title: "SOAP for Beginners", author: "John Doe", year: 2023 },
];

// ✅ SOAP service definition (operations)
export const service = {
  BookService: {
    BookPort: {
      GetBook({ id }) {
        const book = books.find((b) => b.id === Number(id));
        if (!book) throw { Fault: { faultstring: "Book not found" } };
        return book;
      },
      CreateBook({ title, author, year }) {
        const newBook = {
          id: books.length + 1,
          title,
          author,
          year: Number(year),
        };
        books.push(newBook);
        return { message: "Book created", id: newBook.id };
      },
      UpdateBook({ id, title, author, year }) {
        const book = books.find((b) => b.id === Number(id));
        if (!book) throw { Fault: { faultstring: "Book not found" } };
        if (title) book.title = title;
        if (author) book.author = author;
        if (year) book.year = Number(year);
        return { message: "Book updated", id: book.id };
      },
      DeleteBook({ id }) {
        const index = books.findIndex((b) => b.id === Number(id));
        if (index === -1) throw { Fault: { faultstring: "Book not found" } };
        books.splice(index, 1);
        return { message: "Book deleted" };
      },
    },
  },
};

// ✅ Full, valid WSDL definition (XML)
export const xml = `
<definitions name="BookService"
  targetNamespace="http://example.com/books"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://example.com/books"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <message name="GetBookRequest"><part name="id" type="xsd:int"/></message>
  <message name="GetBookResponse">
    <part name="id" type="xsd:int"/>
    <part name="title" type="xsd:string"/>
    <part name="author" type="xsd:string"/>
    <part name="year" type="xsd:int"/>
  </message>

  <message name="CreateBookRequest">
    <part name="title" type="xsd:string"/>
    <part name="author" type="xsd:string"/>
    <part name="year" type="xsd:int"/>
  </message>
  <message name="CreateBookResponse">
    <part name="message" type="xsd:string"/>
    <part name="id" type="xsd:int"/>
  </message>

  <message name="UpdateBookRequest">
    <part name="id" type="xsd:int"/>
    <part name="title" type="xsd:string"/>
    <part name="author" type="xsd:string"/>
    <part name="year" type="xsd:int"/>
  </message>
  <message name="UpdateBookResponse">
    <part name="message" type="xsd:string"/>
    <part name="id" type="xsd:int"/>
  </message>

  <message name="DeleteBookRequest"><part name="id" type="xsd:int"/></message>
  <message name="DeleteBookResponse"><part name="message" type="xsd:string"/></message>

  <portType name="BookPortType">
    <operation name="GetBook">
      <input message="tns:GetBookRequest"/>
      <output message="tns:GetBookResponse"/>
    </operation>
    <operation name="CreateBook">
      <input message="tns:CreateBookRequest"/>
      <output message="tns:CreateBookResponse"/>
    </operation>
    <operation name="UpdateBook">
      <input message="tns:UpdateBookRequest"/>
      <output message="tns:UpdateBookResponse"/>
    </operation>
    <operation name="DeleteBook">
      <input message="tns:DeleteBookRequest"/>
      <output message="tns:DeleteBookResponse"/>
    </operation>
  </portType>

  <binding name="BookBinding" type="tns:BookPortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="GetBook"><soap:operation soapAction="GetBook"/></operation>
    <operation name="CreateBook"><soap:operation soapAction="CreateBook"/></operation>
    <operation name="UpdateBook"><soap:operation soapAction="UpdateBook"/></operation>
    <operation name="DeleteBook"><soap:operation soapAction="DeleteBook"/></operation>
  </binding>

  <service name="BookService">
    <documentation>SOAP Book CRUD API</documentation>
    <port name="BookPort" binding="tns:BookBinding">
      <soap:address location="http://localhost:8080/soap/bookservice"/>
    </port>
  </service>
</definitions>
`;
