
export function to_form_data(obj)
{
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) =>
    {
        if (Array.isArray(value))
        {
            value.forEach((val) => { formData.append(key, val); });
        } else
        {
            formData.append(key, value);
        }
    });

    return formData;
}

export function bind(setter)
{
    return (event) => { setter(event.target.value); }
}
