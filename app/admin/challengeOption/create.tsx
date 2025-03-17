import { BooleanInput, Create, Datagrid, List, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextField, TextInput } from 'react-admin';
import { useGetList } from 'react-admin';
export const ChallengeOptionCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="text" label="Text" />
                <BooleanInput
                    source="correct"
                    label="Correct option"
                />
                <ReferenceInput
                    source="challengeId"
                    reference="challenges"
                    filter={{ type: { $ne: "Action" } }}
                >
                    <SelectInput
                        optionText={(record) => {
                            console.log("Challenge Record:", record);
                            return record?.question || "No question";
                        }}
                    />
                </ReferenceInput>
                <TextInput
                    source='imageSrc'
                    label='Image URL'
                />
            </SimpleForm>
        </Create>
    )
}
