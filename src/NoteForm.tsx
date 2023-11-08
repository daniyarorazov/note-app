import React, {useRef, FormEvent, useState} from 'react';
import {Col, Row, Form, Stack, Button} from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable";
import {Link, useNavigate} from "react-router-dom";
import {NoteData, Tag} from "./App";
import {v4 as uuidV4} from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];

} & Partial<NoteData>
const NoteForm = ({onSubmit, onAddTag, availableTags, markdown = "", title = "", tags = []}: NoteFormProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })

        console.log(selectedTags)

       navigate("..")
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} type="text" placeholder="Enter title" defaultValue={title} required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                onCreateOption={label => {
                                    const newTag = {id: uuidV4(), label}
                                    onAddTag(newTag)
                                    setSelectedTags(prevTags => [...prevTags, newTag]);
                                }}
                                value={selectedTags.map(tag => {
                                    return {value: tag.id, label: tag.label}
                                })}
                                options={availableTags.map(tag => {
                                    return {value: tag.id, label: tag.label}
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return {id: tag.value, label: tag.label}
                                    }))
                                }}
                                isMulti/>
                        </Form.Group>
                    </Col>
                </Row>
                <Col>
                    <Form.Group controlId="markdown">
                        <Form.Label>Body</Form.Label>
                        <Form.Control required as="textarea" ref={markdownRef} defaultValue={markdown} rows={15}/>
                    </Form.Group>
                    <Stack direction="horizontal" gap={2} className="justify-content-end">
                        <Button type="submit" variant="primary">Save</Button>
                        <Link to="/">
                            <Button type="button" variant="outline-secondary">Cancel</Button>
                        </Link>
                    </Stack>
                </Col>
            </Stack>
        </Form>
    );
};

export default NoteForm;