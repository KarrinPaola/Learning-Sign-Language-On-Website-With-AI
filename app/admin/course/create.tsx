import { Create, Datagrid, List, required, SimpleForm, TextField, TextInput } from 'react-admin';

export const CourseCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="id" validate={[required()]} label="Id" />
                <TextInput source="title" validate={[required()]} label="Title" />
                <TextInput source="imageSrc" validate={[required()]} label="Image" />
            </SimpleForm>
        </Create>
    )
}