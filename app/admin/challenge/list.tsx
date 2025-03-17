import { Datagrid, List, NumberField, ReferenceField, SelectField, TextField } from 'react-admin';

export const ChallengeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="question" />
                <TextField source="imageSrc" />
                <SelectField 
                    source="type" 
                    choices={[
                        { id: 'SELECT', name: 'SELECT' },
                        { id: 'ASSIST', name: 'ASSIST' },
                        { id: 'ACTION', name: 'ACTION' },
                    ]}
                />
                <ReferenceField source="lessonId" reference="lessons">
                </ReferenceField>
                <NumberField source="order" />
            </Datagrid>
        </List>
    )
}