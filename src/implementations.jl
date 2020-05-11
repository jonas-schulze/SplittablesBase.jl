# Load docstring from markdown files:
for (name, path) in [
    :SplittablesBase => joinpath(dirname(@__DIR__), "README.md"),
    :halve => joinpath(@__DIR__, "halve.md"),
    :amount => joinpath(@__DIR__, "amount.md"),
]
    try
        include_dependency(path)
        str = read(path, String)
        @eval @doc $str $name
    catch err
        @error "Failed to import docstring for $name" exception = (err, catch_backtrace())
    end
end

"""
    _unzip(xs::Tuple)

# Examples
```jldoctest; setup = :(using SplittablesBase.Implementations: _unzip)
julia> _unzip(((1, 2, 3), (4, 5, 6)))
((1, 4), (2, 5), (3, 6))
```
"""
_unzip(xs::Tuple{Vararg{NTuple{N,Any}}}) where {N} = ntuple(i -> map(x -> x[i], xs), N)

if isdefined(Iterators, :Zip1)  # VERSION < v"1.1-"
    arguments(xs::Iterators.Zip1) = (xs.a,)
    arguments(xs::Iterators.Zip2) = (xs.a, xs.b)
    arguments(xs::Iterators.Zip) = (xs.a, arguments(xs.z)...)
else
    arguments(xs::Iterators.Zip) = xs.is
end
if isdefined(Iterators, :AbstractZipIterator)  # VERSION < v"1.1-"
    const _Zip = Iterators.AbstractZipIterator
else
    const _Zip = Iterators.Zip
end

amount(xs) = length(xs)
amount(xs::AbstractString) = lastindex(xs) - firstindex(xs) + 1

function halve(xs::AbstractVector)
    mid = length(xs) ÷ 2
    left = @view xs[firstindex(xs):firstindex(xs)-1+mid]
    right = @view xs[firstindex(xs)+mid:end]
    return (left, right)
end

function halve(xs::AbstractArray)
    i = something(findlast(x -> x > 1, size(xs)), 1)
    mid = size(xs, i) ÷ 2
    leftranges = ntuple(ndims(xs)) do j
        if i == j
            firstindex(xs, j):firstindex(xs, j) + mid - 1
        else
            firstindex(xs, j):lastindex(xs, j)
        end
    end
    rightranges = ntuple(ndims(xs)) do j
        if i == j
            firstindex(xs, j) + mid:lastindex(xs, j)
        else
            firstindex(xs, j):lastindex(xs, j)
        end
    end
    return (view(xs, leftranges...), view(xs, rightranges...))
end

halve(xs::AbstractArray{<:Any,0}) = ((), xs)

struct DictView{D}
    dict::D
    firstslot::Int
    lastslot::Int
end

DictView(xs::DictView, i::Int, j::Int) = DictView(xs.dict, i, j)

Base.IteratorEltype(::Type{DV}) where {D, DV <: DictView{D}} = Base.IteratorEltype(D)
Base.IteratorSize(::Type{<:DictView}) = Base.SizeUnknown()

Base.eltype(::Type{DV}) where {D, DV <: DictView{D}} = eltype(D)

# Note: this relies on the implementation detail of `iterate(::Dict)`.
function Base.iterate(xs::DictView, i = xs.firstslot)
    i <= xs.lastslot || return nothing
    y = iterate(xs.dict, i)
    y === nothing && return nothing
    _, j = y
    # If `j` is `xs.lastslot + 1` or smaller, it means the current element is
    # within the range of this `DictView`:
    j <= xs.lastslot + 1 && return y
    # Otherwise, we need to stop:
    return nothing
end

function Base.length(xs::DictView)
    n = 0
    for _ in xs
        n += 1
    end
    return n
end

firstslot(xs::Dict) = xs.idxfloor
lastslot(xs::Dict) = lastindex(xs.slots)

firstslot(xs::DictView) = xs.firstslot
lastslot(xs::DictView) = xs.lastslot

amount(xs::Union{Dict,DictView}) = lastslot(xs) - firstslot(xs) + 1

function halve(xs::Union{Dict,DictView})
    i1 = firstslot(xs)
    i3 = lastslot(xs)
    i2 = (i3 - i1 + 1) ÷ 2 + i1
    left = DictView(xs, i1, i2 - 1)
    right = DictView(xs, i2, i3)
    return (left, right)
end

function halve(xs::AbstractString)
    offset = firstindex(xs) - 1
    mid = thisind(xs, (lastindex(xs) - offset) ÷ 2 + offset)
    left = SubString(xs, firstindex(xs):mid)
    right = SubString(xs, nextind(xs, mid):lastindex(xs))
    return (left, right)
end

@generated function halve(xs::NTuple{N,Any}) where {N}
    m = N ÷ 2
    quote
        (($([:(xs[$i]) for i in 1:m]...),), ($([:(xs[$i]) for i in m+1:N]...),))
    end
end

@inline function halve(xs::NamedTuple{names}) where {names}
    lnames, rnames = halve(names)
    return NamedTuple{lnames}(xs), NamedTuple{rnames}(xs)
end

function halve(xs::_Zip)
    lefts, rights = _unzip(map(halve, arguments(xs)))
    return zip(lefts...), zip(rights...)
end

function halve(product::Iterators.ProductIterator)
    i = findlast(x -> length(x) > 1, product.iterators)
    if i === nothing
        # It doesn't matter which "dimension" is used.
        left, right = halve(product.iterators[1])
    else
        left, right = halve(product.iterators[i])
    end
    return (@set(product.iterators[i] = left), @set(product.iterators[i] = right))
end

function halve(xs::Iterators.PartitionIterator)
    coll = xs.c
    n = xs.n
    m = n * cld(div(length(coll), n), 2)
    offset = firstindex(coll) - 1
    return (
        Iterators.partition(view(coll, offset .+ (1:m)), n),
        Iterators.partition(view(coll, offset .+ (m+1:length(coll))), n),
    )
end

function halve(xs::Iterators.Enumerate)
    left, right = halve(xs.itr)
    return enumerate(left), zip(length(left)+1:length(xs), right)
end